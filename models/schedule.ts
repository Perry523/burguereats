import type { Service } from "./services";
import type { User } from "./user";

export interface Schedule {
  service: Service;
  user: Pick<User, "id" | "name">;
  hour: string;
}
