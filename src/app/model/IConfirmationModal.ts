import { Observable, of } from "rxjs";

export interface ConfirmationModal {
    message: string;
    onConfirm: () => Observable<any>
}

export function emptyConfirmationModal(): ConfirmationModal {
    return {
        message: '',
        onConfirm: () => of()
    }
}

export function createConfirmationModal(params: Partial<ConfirmationModal>): ConfirmationModal {
    const confirmationModal: ConfirmationModal = emptyConfirmationModal();
    if (params) {
        params.message ? confirmationModal.message = params.message : null;
        params.onConfirm ? confirmationModal.onConfirm = params.onConfirm : null;
    }
    return confirmationModal;
}