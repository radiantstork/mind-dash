import styles from "./SubmitButton.module.css";

type SubmitButtonProps = {
    onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
    return (
        <button
            className={styles.submitButton}
            onClick={onClick}>
                Submit
        </button>
    );
};

export default SubmitButton;
