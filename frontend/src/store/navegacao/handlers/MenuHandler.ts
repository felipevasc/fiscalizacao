import { useState } from "react";
import type { MenuStoreType } from "../types/MenuStoreType";

const useMenuHandler = (): MenuStoreType => {
    const [menuEsquerdo, setMenuEsquerdo] = useState<boolean>(false);
    const [menuDireito, setMenuDireito] = useState<boolean>(false);
    const [menuSuperior, setMenuSuperior] = useState<boolean>(false);
    const [menuInferior, setMenuInferior] = useState<boolean>(false);
    const [elementoSuperior, setElementoSuperior] = useState<HTMLElement | null>(null)
    const get = (tipo: string) => {
        switch (tipo) {
            case 'esquerdo':
                return menuEsquerdo;
            case 'direito':
                return menuDireito;
            case 'superior':
                return menuSuperior;
            case 'inferior':
                return menuInferior;
            default:
                return false;
        }
    }
    const set = (tipo: string, value: boolean) => {
        switch (tipo) {
            case 'esquerdo':
                return setMenuEsquerdo(value);
            case 'direito':
                return setMenuDireito(value);
            case 'superior':
                return setMenuSuperior(value);
            case 'inferior':
                return setMenuInferior(value);
            default:
                return;
        }
    }

    return {
        menuDireito: {
            get: get('direito'),
            open: () => set('direito', true),
            close: () => set('direito', false),
            toogle: () => set('direito', !menuDireito),
        },
        menuEsquerdo: {
            get: get('esquerdo'),
            open: () => set('esquerdo', true),
            close: () => set('esquerdo', false),
            toogle: () => set('esquerdo', !menuEsquerdo),
        },
        menuSuperior: {
            get: Boolean(elementoSuperior),
            open: () => set('superior', true),
            close: () => set('superior', false),
            toogle: () => set('superior', !menuSuperior),
            getElemento: elementoSuperior,
            setElemento: setElementoSuperior,
        },
        menuInferior: {
            get: get('inferior'),
            open: () => set('inferior', true),
            close: () => set('inferior', false),
            toogle: () => set('inferior', !menuInferior),
        },
    }
}

export default useMenuHandler;