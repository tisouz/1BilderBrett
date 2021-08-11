import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TagState {
  tags: string[] 
}

const initialState: TagState ={
  tags: []
}

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    setTags(state, action: PayloadAction<string[]>) {
        state.tags = action.payload;
    }
  }

});

export const { setTags } = tagSlice.actions;
export default tagSlice.reducer; 