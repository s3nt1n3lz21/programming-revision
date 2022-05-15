export interface IButton {
    label: string,
    matIcon: string,
}

export function emptyButton(): IButton {
    return {
        label: '',
        matIcon: '',
    }
}

export function createButton(params: Partial<IButton>) {
    const button: IButton = emptyButton();
    if (params) {
        params.label ? button.label = params.label : null;
        params.matIcon ? button.matIcon = params.matIcon : null;
    }
    return button;
}