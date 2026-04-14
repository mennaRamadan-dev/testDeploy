import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Comment from "./../comment/comment";
import { Link } from "react-router-dom";
import CreatePost from "./../CreatePost/CreatePost";
import CreatCommentModal from "../CreatCommentModal/CreateCommentModal";
import DeletePosting from "./../DeletePosting/DeletePosting";
import UpdatePost from "./../UpdatePost/UpdatePost";
import { jwtDecode } from "jwt-decode";
import LikePosts from "../LikePosts/LikePosts";

export default function Home() {
  const token = localStorage.getItem("userToken");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.user;
  }

  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,

    staleTime: 20000, //بحدد الوقت اللي بعده يعتبر الداتا قديمة و يحتاج تحديث
    // retry:3,//عدد مرات اعادة المحاولة في حالة الفشل
    // retryDelay:1000,//الوقت بين كل محاولة و اخرى
    // refetchInterval:5000,//بحدد الوقت اللي بعده يتم اعادة جلب الداتا بشكل تلقائي
    // refetchIntervalInBackground:true,//هل يتم اعادة جلب الداتا حتى لو المستخدم مشغول في تاب تاني او نافذة تانية
    // refetchOnWindowFocus:true,//هل يتم اعادة جلب الداتا لما المستخدم يرجع للتاب او النافذة
    // gcTime:10000,//الوقت اللي بعده يتم حذف الداتا من الذاكرة اذا ما فيش مكون بيستخدمها
  });
  // console.log(data);
  if (isLoading)
    return (
      <div className="text-center p-8">
        <span className="loader"></span>
      </div>
    );
  if (isError)
    return <div className="text-center p-8 text-red-500">{error?.message}</div>;
  if (!data?.data?.data?.posts?.length)
    return <div className="text-center p-8">لا توجد منشورات</div>;

return (
  <>
    <CreatePost />

    {data?.data?.data?.posts
      .filter((post) => post.body || post.image)
      .map((post) => {
        console.log("Post item:", post);

        return (
          <div
            key={post.id}
            className="md:w-[80%] lg:w-[40%] rounded-md bg-slate-200 mx-auto p-2 mb-3"
          >
            <Link to={`/postdetails/${post.id}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={post.user.photo}
                    alt=""
                    className="size-[36px] rounded-full"
                  />
                  <p>{post.user.name}</p>
                </div>

                <div className="text-xs text-slate-400">
                  <p>{post.createdAt}</p>
                </div>
              </div>

              {post.body && <h2 className="mb-4">{post.body}</h2>}

              {post.image && (
                <img
                  src={post.image}
                  alt={post.body}
                  className="w-full max-h-[400px] object-cover rounded-lg"
                />
              )}

              <Comment
                Comment={post.topComment || post.comments?.[0]}
                postId={post.id}
              />
            </Link>

            <div className="flex items-center justify-between gap-2 mt-3">
                <LikePosts
                postId={post.id}
                likedByUser={post.likedByUser}
                likesCount={post.likesCount}
              />
              <CreatCommentModal postId={post.id} />

            

              {( post.user?.id === userId) && (
                <div className="flex gap-2">
                  <DeletePosting postId={post.id} />
                  <UpdatePost postId={post.id} />
                </div>
              )}
            </div>
          </div>
        );
      })}
  </>
);
}