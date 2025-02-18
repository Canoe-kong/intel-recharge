type ButtonType =
  | 'default'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
type ButtonSize = 'xlarge' | 'large' | 'normal' | 'small' | 'mini'
type ButtonShape = 'square' | 'round'
type ButtonFill = 'solid' | 'outline' | 'dashed' | 'none'
export interface CommonButtonProps  {
  name: string,
  color?: string,
  shape?: ButtonShape,
  type?: ButtonType,
  size?: ButtonSize,
  fill?: ButtonFill,
  block?: boolean,
  loading?: boolean,
  disabled?: boolean,
  icon?: React.ReactNode,
  rightIcon?: React.ReactNode,
  id?: string,
  duration?: number,
  nativeType?: 'submit' | 'reset' | 'button',
  onClick: () => void
}