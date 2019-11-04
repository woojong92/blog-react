import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

// 요청 검증
// 500 오류는 보통 서버에서 처리하지 않아 내부적으로 문제가 생겼을 때 발생
// 잘못된 id를 전달했다면 400 bad request 오류를 띄워주는 게 맞다. 
const {ObjectId} = mongoose.Types;

// id 값을 검증하는 미들웨어
export const checkObjectId = ( ctx, next ) => {
    const {id} = ctx.params;
    if( !ObjectId.isValid(id)) {
        ctx.status = 400; // bad request
        return;
    }
    return next();
}

// 포스트의 인스턴스를 만들 때는, new 키워드를 사용
// 그리고 생성자 함수의 파라미터에 정보를 지닌 객체를 넣는다. 
// save() 함수를 실행시켜야 데이터베이스에 저장됨.
export const write = async ctx => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), //  required()가 잇으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required(), // 문자열로 이루어진 배열
    });

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = Joi.validate(ctx.request.body, schema);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }
    
    const {title, body, tags} = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
    });
    try{
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
}

// find() 함수를 호출한 후에 exec()를 붙여 주어야 서버에 쿼리를 요청한다.
export const list = async ctx => {
    try{
        const posts = await Post.find().exec();
        ctx.body = posts;
    } catch (e) {
        ctx.throw(500, e);
    }
}

export const read = async ctx => {
    const {id} = ctx.params;
    try{
        const post = await Post.findById(id).exec();
        if(!post){
            ctx.status = 404; // not found
            return;
        }
        ctx.body = post;
    }catch(e) {
        ctx.throw(500, e)
    }
}

// remove(): 특정 조건을 만족하는 데이터를 모두 지움
// findByIdAndRemove(): id를 찾아서 지운다. 
// findOneAndRemove(): 특정 조건을 만족하는 데이터 하나를 찾아서 제거
export const remove = async ctx => {
    const {id} = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Content ( 성공은 했지만 응답할 데이터는 없음 )
    }catch(e) {
        throw(500, e);
    }
}

// findByIdAndUpdate() 함수 사용
export const update = async ctx => {
    const {id} = ctx.params;
    // write에서 사용한 schema와 비슷한데, required()가 없다.
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string(), //  required()가 잇으면 필수 항목
        body: Joi.string(),
        tags: Joi.array().items(Joi.string())
    });

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = Joi.validate(ctx.request.body, schema);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    try{
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // 이 값을 성정하면 업데이트된 데이터를 반환
                        // false일 때는 업데이트되기 전의 데이터를 반환한다.
        }).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    }catch(e) {
        throw(500, e);
    }
}





