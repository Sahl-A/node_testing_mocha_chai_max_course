## 1 ==>

- 

## 2 ==>

- 


## 3 ==>

- mocha is used for running the tests (excute the test code)
- chai is used for asserting results  (Validating the test outcome)
- sinon is used for managing side effects / external dependecies 


## 4 (commit dcce550) ==>

- Run a dummy test to start with mocha & chai 
    - Add "test": "mocha" under scripts object in package.json
    - Add folder 'test' and inside it add any js files. Inside these files write your tests
    - Add a dummy test cases using it('title', function(){
        const a=3, b=2;
        expect(a+b).to.equal(5)
    });
    - in the terminal: npm run test


## 5 (commit d74e48a) ==>

- We use unit testing. It means we test certain function. not whole scienaro. 
- We write our tests to make sure if we changed anything in the code later, to make sure it will not change of the behaviour of the unit
- Add another file called auth-middleware.js to test is-auth middleware
- Write your test targeting only one input or one output. 
- Here we will check if it receives no authorization header. In this case, it should throws an error with 'No token was sent' 
- We pass the same number of argumenet the original function expects
- We create a dummy input to the function if it will use it in our test



## 6 (commit 9da68a1) ==>

- We can add more than one test for the same unit/function 
- Add second test to is-auth middleware. This should throw an error if the received authorization is one string without spaces.
- When we tests more than one unit, we should organize and group the test for each unit under one description
- That's why describe method is added


## 7 (commit 396db10) ==>

- What not to test? 
    - Inside is-auth middleware, we use jwt.verify, we should not test verify() method, as this is 3rd party method
    - It is the 3rd party's job to test it, and they do. So, do not test it inside your app
    - We should test if it throws an error if the passed token is invalid 
    - But what if we need to test if req has userId, this happens only if we pass verify method, so,
    - we need to have the correct token or find another way which we will know in next videos


## 8 (commit e89dc5b) ==>

- Solution to above issue is to use stubs 
    - We could import jwt & replace the verify method by assigning it to a dummy function that always pass and returns userId
    - This approach has a flaw, if we needed to test anything else, it will use the dummy verify method.
    - So, we use sinon package to change the verify method and return it to the original one at the end of the same test, so other tests are not affected



## 9 (commit e916aeb) ==>

- Test controllers, in particular, auth controllers 

- We do not test app.get('/login', authControllers.login) as this route this is handled by express, they tested it well.

- We test login function inside auth.js inside contollers folder

- We need to test the return of User.findOne(). We need to test if it fails to connect to DB

- Use sinon to create stub for findOne and then make it to throw error.

- However, there is an issue when we will come to write expect(authControllers.login)
    - The issue is this login method runs async, so, we will handle this in next video



## 10 (commit 1c7c381) ==> 

- mocha has done argument that is passed to the function inside it('description', function(done){
    // Test code here
    - after running all your async code, run done()
})

- when done passed, mocha does not end the test until it is called. 

- So, we run authControllers.login(req, {}, ()=> {}).then(res => {
    expect(res).to.be.an('error');
    expect(res).to.have.property('statusCode', 500);
    done();
})


## 11 (commit 40a4fa4 ) ==>

- Test with DB

- Surely, we can use stubs to fake DB test. But sometimes we want to really test real DB by conneting to it, getting users data back

- Connect normaly to the DB as we connect in app.js. BUT connect to a test database, not the one with the real data

- Instead of running the server, create a new user and save it to DB

- Continue in next video 


## 12 (commit 6aae8bf ) ==>

- Inside user.save().then(()=> {
    - Here we write our logic
    - We need to test the following line in the getUserStatus method
        res.status(200).json({ status: user.status });
    - So, in order to reach this line, we need to create a dummy req & res 
    - In the dummy res we define a statusCode property inside status method inside res object
    - we then check in expect(statusCode).to.be.equal(200).
    - The same goes with what inside json({});
    - We write the expect() in then of authControllers.getuserStatus(req, res, ()=> {}).then(()=> {
        expect()
        expect()
        done()
    })
})


## 13 (commit db7b3c3 ) ==>

- In last video we had some issue:
    - We had to kill terminal after the test as mocha test did not end the test, because mongoose connection was still acitve
        - Solution: use mongoose.disconnect().then(()=> {})

    - When repeating the test, it fails as mongoDB throws error cause it finds users with duplicate id due to the setup we wrote
        - Solution: we use User.deleteMany({}) and then we disconnect the DB

- There is more cleaner way to replace all this, in next video


## 14 ( commit a44c498 ) ==>

- There are functions in mocha that can run before/after all tests. Also before/after each test

- We will use before(done => {
    - run here code to add the user to the DB
    - then use done()
})

- We will use after(done => {
    - run code to remove all the users created
    - run code to disconnect the DB
    - then use done()
})

- Using before/after/beforeEach/afterEach organized our code. 
