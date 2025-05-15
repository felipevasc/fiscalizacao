import { BrModal } from '@govbr-ds/react-components';

type ModalActionProps = {
  action: () => void;
  disabled?: boolean;
  label: string;
};

type ModalProps = {
  title?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  primaryAction: ModalActionProps;
  secondaryAction?: ModalActionProps;
  onClose?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  primaryAction,
  children,
  isOpen,
  onClose,
  secondaryAction,
  title,
}) => {
  return (
    <BrModal
      isOpen={isOpen}
      primaryAction={primaryAction}
      onClose={onClose}
      secondaryAction={secondaryAction}
      title={title}>
      {children}
    </BrModal>
  );
};

export default Modal;
