const express = require('express') // express
const userRoutes = require('./routes/user') // 유저 라우터
const cors = require("cors") // cors 
const errorContrller = require('./controllers/error') // 에러 컨트롤러
const { swaggerUi, specs } = require('./swagger') // 스웨거 설정

const redisClient = require('./util/redis.js');

const app = express() // 어플리케이션 객체 생성
const ports = process.env.PORT || 3000 // 포트 번호

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); // 스웨거 실행

app.use(express.json()) // json 파싱 설정(parsing application/json)
app.use(express.urlencoded({ extended: true })) //() url 인코딩 설정(parsing application/x-www-form-urlencoded)

// cors 미들웨어 설정
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const go = async () => {
    await redisClient.set('String Key', 'String Value', redis.print)

    redisClient.get('String Key', function (err, value) {
        if (err) 
            throw err;
        console.log(value);
    });
} 

go()

// 유저 라우터 실행
app.use('/users', userRoutes)

// 에러 컨트롤러
app.use(errorContrller.get404)
app.use(errorContrller.get500)

// 서버 실행
app.listen(ports, () => console.log(`${ports} 포트 리스닝중...`))

