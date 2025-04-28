report:
	npx playwright show-report
wolf: 
	npx playwright test wolf-test.spec.js 
failed:
	npx playwright test --last-failed
all: 
	npx playwright test 
status: 
	npx playwright test wolf.status.spec.js 
passport: 
	npx playwright test USPS.spec.js --headed
mobile: 
	npx playwright test application_mobile.spec.js --headed