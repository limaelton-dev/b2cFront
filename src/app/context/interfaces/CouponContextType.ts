import { CouponShow } from "../../interfaces/CouponShow";


export interface CouponContextType {
  statusMessage: string;
  activeCoupon: undefined | boolean;
  coupon: CouponShow;
  setCouponFn: (coupon: CouponShow) => void;
}
