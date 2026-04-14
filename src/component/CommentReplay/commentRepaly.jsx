import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

function getRepliesFromResponse(response) {
  // console.log("Parsing replies from response:", response);
  const data = response?.data;
  if (!data) return [];
  if (Array.isArray(data)) return data;

  function findArray(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      for (const key of Object.keys(value)) {
        const found = findArray(value[key]);
        if (found) return found;
      }
    }
    return null;
  }

  const replies = findArray(data);
  return replies || [];
}
function getReplyAuthorName(reply) {
  console.log("Finding author name for reply:", reply);
  return reply?.commentCreator?.name || "Anonymous";
}

function getReplyAuthorPhoto(reply) {
  return reply?.commentCreator?.photo;
}

const emojiList = ["😀", "😂", "😍", "👍", "🔥", "😢", "🎉", "🙌", "❤️", "😎"];

export default function CommentRepaly({ postId, commentId, onReplyAdded }) {
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (replyImagePreview) {
        URL.revokeObjectURL(replyImagePreview);
      }
    };
  }, [replyImagePreview]);

  async function fetchReplies() {
    const response = await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=20`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response?.data?.data?.replies || [];
  }

  const {
    data: replies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getCommentReplies", postId, commentId],
    queryFn: fetchReplies,
    enabled: !!postId && !!commentId,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function handleEmojiClick(emoji) {
    setReplyText((prev) => prev + emoji);
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setReplyImage(file);
    setReplyImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setReplyImage(null);
    setReplyImagePreview(null);
  }

  async function handleReplySubmit(event) {
    event.preventDefault();

    if (!replyText.trim() && !replyImage) {
      toast.error("Please add text, image, or emoji before sending.");
      return;
    }

    try {
      const url = `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`;
      if (replyImage) {
        const formData = new FormData();
        if (replyText.trim()) {
          formData.append("content", replyText);
        }
        formData.append("image", replyImage);

        await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(
          url,
          { content: replyText },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      toast.success("Reply added successfully");
      setReplyText("");
      setReplyImage(null);
      setReplyImagePreview(null);
      queryClient.invalidateQueries({
        queryKey: ["getCommentReplies", postId, commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentReplyCount", postId, commentId],
      });
      if (typeof onReplyAdded === "function") {
        onReplyAdded();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post reply.");
    }
  }

  if (isLoading) {
    return <div className="text-sm text-slate-400">Loading replies...</div>;
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500">
        {error?.message || "Unable to load replies."}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
      <div className="mb-3 space-y-3">
        <form onSubmit={handleReplySubmit} className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              placeholder="Write your reply..."
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600 transition"
            >
              Send
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-200 hover:bg-slate-700"
              aria-label="Toggle emoji picker"
            >
              <i className="fa-regular fa-face-smile"></i>
            </button>

            <label
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-200 hover:bg-slate-700"
              aria-label="Attach image"
            >
              <i className="fa-regular fa-image"></i>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {showEmojiPicker && (
            <div className="flex flex-wrap gap-2 pt-2">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-2 py-1 text-sm hover:bg-slate-700"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {replyImagePreview && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3">
              <img
                src={replyImagePreview}
                alt="Reply preview"
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex-1 text-sm text-slate-200">
                {replyImage.name}
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="rounded-xl bg-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-600"
              >
                Remove
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="space-y-2">
        {replies.length === 0 ? (
          <div className="rounded-xl border border-slate-600 bg-slate-200 px-4 py-3 text-center text-sm text-slate-500">
            No replies yet.
          </div>
        ) : (
          replies.map((reply) => (
            console.log("Reply item:", reply),
            <div
              key={ reply.id}
              className="rounded-xl border border-slate-700 bg-slate-950 p-3"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  {getReplyAuthorPhoto(reply) ? (
                    <img
                      src={getReplyAuthorPhoto(reply)}
                      alt={getReplyAuthorName(reply)}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-slate-700" />
                  )}
                  <span>{getReplyAuthorName(reply)}</span>
                </div>
                <span>{reply?.createdAt}</span>
              </div>
              <div className="mt-2 space-y-2">
                {(reply?.content ) && (
                  <p className="text-sm leading-6 text-slate-200">
                    {reply?.content || reply?.text}
                  </p>
                )}
                {( reply?.photo) && (
                  <img
                    src={ reply?.photo}
                    alt="Reply attachment"
                    className="max-h-48 w-full rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
