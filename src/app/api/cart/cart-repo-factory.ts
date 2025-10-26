import { CartRepo } from "./ports/cart-repo";
import { ApiCartRepo } from "./repos/api-cart-repo";
import { GuestCartRepo } from "./repos/guest-cart-repo";
import { isAuthenticated } from "../../utils/auth";

export function makeCartRepo(): CartRepo {
  return isAuthenticated() ? new ApiCartRepo() : new GuestCartRepo();
}
