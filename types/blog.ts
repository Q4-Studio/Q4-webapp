export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    image: string;
  };
}
