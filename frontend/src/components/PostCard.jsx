import { Link } from "react-router-dom";
import "../assets/PostCard.css"; // import CSS

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <img src={post.thumbnail} alt={post.title} />

      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 120)}...</p>

      <Link to={`/post/${post.id}`}>Baca Selengkapnya</Link>
    </div>
  );
};

export default PostCard;
