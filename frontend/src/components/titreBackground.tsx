import "../css/titreBackground.css"
import type {ReactNode, ElementType} from "react"

interface TitleBackgroundProps {
    children: ReactNode;
    as?: ElementType;
    className?: string;
}

export default function TitreBackground({ children, as: Tag = "h2", className = ""}: TitleBackgroundProps) {
    return (
        <Tag className={`titre-avec-bg ${className}`}>
            {children}
        </Tag>
    )
}