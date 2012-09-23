build:
	@rm -rf product tests
	@echo "Creating /html..."
	@mkdir -p html
	@echo "Clearing out folder..."
	@rm -rf html/*
	@echo "Copying in dependencies..."
	@cp -r assets/ks-files/* html/
	@echo "Building from templates..."
	@node build.js
	@echo "Copying images"
	@cp -r assets/img html/
	@cp assets/update.js html/

	@echo "Pseudo-RESTful directories. I'll get Django up one of these days..."
	@mkdir -p html/docs/1.1 html/extend html/apps html/themes html/upgrade
	@mv html/docs.html html/docs/index.html
	@cp html/docs/index.html html/docs/1.1/
	@mv html/extend.html html/extend/index.html
	@mv html/apps.html html/apps/index.html
	@mv html/themes.html html/themes/index.html
	@mv html/upgrade.html html/upgrade/index.html

	@echo "Moving in app zips."
	@mkdir -p html/apps/download
	@cp -r assets/app-zips/* html/apps/download/

	@echo "Doing a shitty job making index.html also work on github pages"
	@cp -r assets/ks-files/Kickstrap ./
	@cp -r assets/ks-files/css ./
	@cp -r assets/ks-files/theme.less ./
	@cp assets/misc/kickstrap.less ./
	@mv html/indexGh.html ./index.html	
