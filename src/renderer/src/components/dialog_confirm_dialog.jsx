import Modal from './Modal'

function DialogConfirmDialog({ isShow = false, onClose, message, onConfirm}) {
    return (
        <Modal isOpen={isShow} onClose={() => onClose} showHeader={false} width="350px">
            <div className="z-ae-container w-100">
                <div className="center">
                    <p className="text-center fw-bold fs-20 text-danger error-message">Xác nhận</p>
                    <p className="text-center fw-bold fs-20 text-danger">{message}</p>
                </div>
            </div>
            <div className="page-btns end">
                <button
                    className="repair-modal__button cancel-button"
                    onClick={() => {
                        onClose()
                    }}
                >
                    Hủy
                </button>
                <button
                    className="repair-modal__button confirm-button"
                    disabled={false}
                    onClick={async () => onConfirm()}
                >
                    Xoá
                </button>
            </div>
        </Modal>
    )
}

export default DialogConfirmDialog
