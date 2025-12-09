import { CartRepo } from "./ports/cart-repo";
import { ApiCartRepo } from "./repos/api-cart-repo";
import { GuestCartRepo } from "./repos/guest-cart-repo";

export function makeCartRepo(isAuthenticated: boolean): CartRepo {
  return isAuthenticated ? new ApiCartRepo() : new GuestCartRepo();
}
