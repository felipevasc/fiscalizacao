import { BrCard } from '@govbr-ds/react-components';

type CardProps = {
  title?: string;
  children?: React.ReactNode;
  subtitle?: string;
};

const Card: React.FC<CardProps> = ({ children, subtitle, title }) => {
  return (
    <BrCard title={title} subtitle={subtitle}>
      {children}
    </BrCard>
  );
};

export default Card;
