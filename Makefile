report:
	npx playwright show-report
wolf: 
	npx playwright test wolf-test.spec.js 
failed:
	npx playwright test --last-failed --headed
all: 
	npx playwright test 
status: 
	npx playwright test wolf.status.spec.js 
passport: 
	npx playwright test passport.spec.js 

mobile: 
	npx playwright test currency_mobile.spec.js --headed