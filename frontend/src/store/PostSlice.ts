import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance as axios } from '../axios-content';

import { getAuthorizationHeader } from '../util';

export interface Comment {
    authorName: string,
    userId: string,
    content: string,
    id: string
}

interface Tag {
    content: string,
    id: string
}

interface PostState {
    loading: boolean,
    error: string | null | undefined,
    upvotes: number | null,
    downvotes: number | null,
    postId: number | null,
    content: string | null,
    mediaType: string | null,
    userName: string | null,
    userId: number | null,
    comments: Comment[] | null
    tags: Tag[] | null
}

interface PostFetchArguments {
    accessToken: string,
    postId: number
}

interface PostFetchResponse {
    upvotes: number,
    downvotes: number,
    postId: number,
    content: string,
    mediaType: string,
    userName: string,
    userId: number,
    comments: Comment[],
    tags: Tag[]
}

const initialState: PostState = {
    loading: false,
    error: null,
    upvotes: null,
    downvotes: null,
    postId: null,
    content: null,
    mediaType: null,
    userName: null,
    userId: null,
    comments: null,
    tags: null,
}

export const fetchPost = createAsyncThunk<
    PostFetchResponse,
    PostFetchArguments,
    {
        rejectValue: string
    }
>('post/fetchPost', (fetchArguments: PostFetchArguments, thunkAPI) => {
    let endpoint = '/posts/' + fetchArguments.postId.toString();
    const authHeader = getAuthorizationHeader(fetchArguments.accessToken);

    return axios.get(endpoint, authHeader)
        .then(res => {
            const response: PostFetchResponse = {
                upvotes: res.data.num_vote_up,
                downvotes: res.data.num_vote_down,
                postId: res.data.id,
                content: res.data.file,
                mediaType: res.data.media_type,
                userName: res.data.username,
                userId: res.data.user,
                comments: res.data.comments.map((comment: any) => {
                    const ret: Comment = {
                        authorName: comment.username,
                        userId: comment.user,
                        content: comment.content,
                        id: comment.id
                    }
                    return ret;
                }),
                tags: res.data.tags.map((tag: any) => {
                    const ret: Tag = {
                        content: tag.content,
                        id: tag.id
                    }
                    return ret;
                })
            }
            return response
        })
        .catch(err => {
            return thunkAPI.rejectWithValue(err.response.data.detail);
        })

});

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addTag(state, action: PayloadAction<string>) {
            if (state.tags === null)
                return
            const tagAlreadyExists = state.tags.map(tag => tag.content)
                                        .includes(action.payload)
            if (tagAlreadyExists === true)
                return;
            else {
                const newTag: Tag = {
                    content: action.payload,
                    id: action.payload
                }
                state.tags.push(newTag);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPost.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.upvotes = action.payload.upvotes;
            state.downvotes = action.payload.downvotes;
            state.postId = action.payload.postId;
            state.content = action.payload.content;
            state.mediaType = action.payload.mediaType;
            state.userName = action.payload.userName;
            state.userId = action.payload.userId;
            state.comments = action.payload.comments;
            state.tags = action.payload.tags;
        });
        builder.addCase(fetchPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.upvotes = null;
            state.downvotes = null;
            state.postId = null;
            state.content = null;
            state.mediaType = null;
            state.userName = null;
            state.userId = null;
            state.comments = null;
            state.tags = null;

        });
        builder.addCase(fetchPost.pending, state => {
            state.loading = true;
        });
    }
});

export const { addTag } = postSlice.actions;
export default postSlice.reducer;