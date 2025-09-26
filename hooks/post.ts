// hooks/post.ts

import { useState } from "react";
import useApi from "@/lib/api";
import { omit } from "lodash";
import { useAssetContext } from "@/contexts/AssetContext";

export interface PostHook {
  id: number;
  hook: string;
}
export interface GenerateHooksRequest {
  input: string;
}
export interface PostResponse {
  post: string;
}

export interface Post {
  id: string;
  userId: string;
  brandId: string;
  designId: string;
  content?: string;
  imageUrl?: string;
  pdfUrl?: string;
}

export const useGenerateHooks = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);

  const generateHooks = async (input: string): Promise<PostHook[]> => {
    setLoading(true);
    setHookError(null);

    try {
      const response = await api.post("posts/generate-hooks", { input });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || "Failed to generate hooks");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to generate hooks");
      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [generateHooks, { loading, error }] as const;
};

export const useGeneratePost = () => {
  const {
    state: { posts },
    setPosts,
  } = useAssetContext();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setPostError] = useState<Error | null>(null);

  const generatePost = async (hook: string, brandId: string): Promise<Post> => {
    setLoading(true);
    setPostError(null);

    try {
      const response = await api.post("posts/generate-post", {
        hook,
        brandId,
      });

      if (response.success && response.data) {
        const post = omit(response.data, ["updatedAt", "createdAt"]) as Post;
        const udpatedPostArray = posts;
        udpatedPostArray.push(post);
        setPosts(udpatedPostArray);
        return post;
      } else {
        throw new Error(response.error || "Failed to generate post");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setPostError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // 4. Return the function and state variables, same as the example
  return [generatePost, { loading, error }] as const;
};

// export const useGetAllPosts = () => {
//   const api = useApi();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   const getAllPosts = async (brandId?: string): Promise<Post[]> => {
//     setLoading(true);
//     setError(null);

//     try {
//       const url = brandId ? `posts?brandId=${brandId}` : "posts";
//       const response = await api.get(url);

//       if (response.success) {
//         return response.data;
//       } else {
//         throw new Error(response.error || "Failed to fetch posts");
//       }
//     } catch (err) {
//       const errorObj =
//         err instanceof Error ? err : new Error("Failed to fetch posts");
//       setError(errorObj);
//       throw errorObj;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return [getAllPosts, { loading, error }] as const;
// };

export const useGetPost = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPost = async (id: string): Promise<Post> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`posts/${id}`);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || "Failed to fetch post");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to fetch post");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [getPost, { loading, error }] as const;
};

export const useGetPostsByBrand = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPostsByBrand = async (brandId: string): Promise<Post[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`posts?brandId=${brandId}`);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || "Failed to fetch posts for brand");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error("Failed to fetch posts for brand");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [getPostsByBrand, { loading, error }] as const;
};

export const useUpdatePost = () => {
  const {
    state: { posts },
    setPosts,
  } = useAssetContext();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePost = async (
    id: string,
    updates: {
      content?: string;
      imageUrl?: string;
      pdfUrl?: string;
      designId?: string;
    }
  ): Promise<Post> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`posts/${id}`, updates);

      if (response.success) {
        const updatedPost = response.data as Post;
        
        // Update the post in the context
        const updatedPosts = posts.map(post => 
          post.id === id ? updatedPost : post
        );
        setPosts(updatedPosts);
        
        return updatedPost;
      } else {
        throw new Error(response.error || "Failed to update post");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to update post");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [updatePost, { loading, error }] as const;
};
