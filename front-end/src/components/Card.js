import { Button } from "@material-ui/core";

export default function Card({text}) {
    return (
        <Button className="hand-card" variant='contained' fullWidth >
            {text} 
        </Button>
    );
}