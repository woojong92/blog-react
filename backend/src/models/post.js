import mongoose from 'mongoose'

const { Schema } = mongoose

const PostSchema = new Schema({
    title: String,
    body: String,
    tags: [String],
    publishedDate: {
        type: Date,
        default: Date.now,
    }
})
// mongoose.model은 두 개의 파라미터를 필요함.
// 첫번째 파라미터는 스키마의 이름,
// 두번째 파라미터는 스키마 객체
const Post = mongoose.model('Post', PostSchema)
export default Post