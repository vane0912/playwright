report:
	npx playwright show-report
wolf: 
	npx playwright test wolf-test.spec.js 
failed:
	npx playwright test --last-failed --headed
all: 
	npx playwright test 
status: 
	npx playwright test USPS.spec.js --headed
passport: 
	npx playwright test passport.spec.js 