export default function Label({ children, ...props }) {
    return (
        <label htmlFor={props.htmlFor}>{ children }</label>
    );
}