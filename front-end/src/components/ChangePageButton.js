import { Link } from "react-router-dom";

export default function ChangePageButton({ name, goToPath }) {
  return (
    <>
      <Link variant="button" color='secondary' to={goToPath}>
        {name}
      </Link>
    </>
  );
}
