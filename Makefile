report:
	npx playwright show-report
wolf: 
	npx playwright test wolf-test.spec.js 
failed:
	npx playwright test --last-failed
all: 
	npx playwright test 
status: 
	npx playwright test login_order_id.spec.js --headed
passport: 
	npx playwright test USPS.spec.js 
mobile: 
	npx playwright test hamburguer_menu_validations.spec.js