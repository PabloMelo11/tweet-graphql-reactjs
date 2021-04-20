export interface ITweet {
  _id: number;
  author: string;
  description: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  formattedDate: string;
}

export interface IQueryData {
  tweets: {
    tweets: ITweet[];
    totalPages: number;
  };
}
