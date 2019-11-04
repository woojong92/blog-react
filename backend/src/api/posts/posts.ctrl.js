import Post from '../../models/post';

// 포스트의 인스턴스를 만들 때는, new 키워드를 사용
// 그리고 생성자 함수의 파라미터에 정보를 지닌 객체를 넣는다. 
// save() 함수를 실행시켜야 데이터베이스에 저장됨.
export const write = async ctx => {
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

export const remove = ctx => {}

export const update = ctx => {}





