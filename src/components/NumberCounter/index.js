import { useCountUp } from 'use-count-up';
import toLangDigits from './../../utils/toLangDigits';

const NumberCounter = ({ num }) => {
    const { value } = useCountUp({ isCounting: true, end: num || 0, duration: 1 });
    return toLangDigits(value)
};

export default NumberCounter;
