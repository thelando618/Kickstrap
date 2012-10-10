$(document).ready(function () {

    // Only open one menu at a time and let the user close by clicking again.
    var mouseInside = false;

    // Determine if mouse is inside the menu already.
    $('ul.sf-menu li').hover(
	    function () { mouseInside = true; },
	    function () { mouseInside = false; }
    );

    // Hide menu if user clicks outside of it.
    $('html').click(function () {
        if (!mouseInside) {
            dismissMenu();
        }
    });
    // ...iframes too.
    $(window).blur(function () {
        dismissMenu();
    });

    if ($('iframe').length > 0) {
        //...seriously, iframes too.
        $('iframe').contents().keydown(function () {
            dismissMenu();
        });

        //...I mean it, IE.
        var getIframe = $('iframe').get(0).contentWindow.document;
        $(getIframe).click(function () {
            dismissMenu();
        });
    }

    $('ul.sf-menu li').click(function () {

        // Allow it to collapse when clicked a second time.
        if (!$('ul.sf-menu > li').hasClass('andStayClosed')) {
            $(this).toggleClass('clicked');
            //console.log('adding "clicked"');
            $('li').not(this).removeClass('clicked');
            //console.log('removing "clicked" from neighbors');
        }
        else {
            $('ul.sf-menu > li').removeClass('andStayClosed')
        }

        // Remove any previous iframes we had open.
        $('.ie-fix').remove();

        // Append iframe in dropdown if it's currently clicked open.
        $('li.clicked > ul').after('<IFRAME src="/branch/scripts/blank.html" class="ie-fix" style="LEFT: 0px;POSITION: absolute;TOP: 30px;width: 200px;height: 400px;z-index: 0" frameBorder="0" scrolling="no"></IFRAME>');
        // Set the iframe to the exact height of the ul container.
        $('.ie-fix').css('height', $('li.clicked > ul').height());

        // If this link goes somewhere, close the menu and leave a token to keep it closed.
        if ($('a', this).attr('href')) {
            var linkLength = $('a', this).attr('href').length;
        }
        //$('ul.sf-menu > li').removeClass('andStayClosed');
        //console.log(linkLength);
        if (linkLength > 2) {
            $('ul.sf-menu > li').removeClass('clicked').addClass('andStayClosed');
            // Token ensures collapse command isn't overriden by simultaneous click event on parent li.
        }

    });

    // Add arrows to all menus with submenus
    $arrow = $(['<span class="sf-sub-indicator"> &#187;</span>'].join(''));
    addArrow = function ($a) { $a.addClass('sf-with-ul').append($arrow.clone()); };
    $('li:has(ul)', this).each(function () {
        addArrow($('>a:first-child', this));
    });

});

function dismissMenu() {
    $('li').removeClass('clicked');
    //console.log('removing "clicked" from outside click');
    //Hide any ie frames we made.
    $('.ie-fix').remove();
};

/* opens notes window in new window if not created, othwerwise brings the notes window to focus. */
var notesWindow = null;
function openNotesWindow(url) {
    if (notesWindow != null && notesWindow.focus) {
        notesWindow.focus();
    }
    else {
        notesWindow = window.open(url, 'Notes', 'height=780,width=1200,resizable=yes,scrollbars=yes,location=no,menubar=no,status=no,toolbar=no');
        if (notesWindow.focus) {
            notesWindow.focus();
        }
    }
}