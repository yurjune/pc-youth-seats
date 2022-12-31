import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, FormControlLabel } from '@mui/material';
import styles from './index.module.scss';

export interface CheckboxProps extends Pick<MuiCheckboxProps, 'checked' | 'onChange'> {
  label: string;
}

export const Checkbox = (props: CheckboxProps) => {
  const { label, checked, onChange } = props;
  return (
    <FormControlLabel
      className={styles.checkbox}
      control={<MuiCheckbox color='secondary' checked={checked} onChange={onChange} />}
      label={label}
    />
  );
};
