import { InstagramPost } from "../../types/Instagram";
import RequestResponse from "../../types/RequestResponse";

const adaptInstagramPostRecord: (record: any) => InstagramPost = record => {
  return {
    id: record.id,
    mediaType: record.media_type,
    mediaUrl: record.media_url,
    permalink: record.permalink
  };
};

export const getInstagramPosts: (params: {
  accessToken: string;
  count: number;
}) => Promise<RequestResponse<InstagramPost[]>> = async ({
  accessToken,
  count
}) => {
  try {
    let igPosts: InstagramPost[] = [];
    let nextUrl = `https://graph.instagram.com/me/media?fields=id,media_type,permalink,media_url&limit=${10}&access_token=${accessToken}`;
    while (igPosts.length < count) {
      const response = await fetch(nextUrl, {
        method: "GET",
        redirect: "follow"
      });
      if (response.status >= 400) {
        throw await response.text();
      }
      const json = await response.json();

      igPosts = [
        ...igPosts,
        ...json.data
          .map(adaptInstagramPostRecord)
          .filter((post: InstagramPost) => post.mediaType === "IMAGE")
      ].slice(0, count);
      nextUrl = json.paging.next;
    }
    return {
      error: false,
      data: igPosts
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message || String(err),
      data: null
    };
  }
};
