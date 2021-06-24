import { from, of, zip } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { USERS_URL } from "../../misc/API URLs";
import { ErrorCodes } from "../../misc/ErrorCodes";
import { inventoryDTOtoInventoryObs } from "../../models/DTOs/inventory-dto";
import { UserDTO, userDTOtoUser } from "../../models/DTOs/user-dto";
import { Inventory } from "../../models/inventory";

export function userLogin(username: string, password: string) {
  const userDtoObs = from(
    fetch(USERS_URL + `?username=${username}&password=${password}`)
      .then((result) => result.json())
      .then((users: Array<UserDTO>) => users[0])
  ).pipe(
    map((userDto) => {
      if (!userDto) throw new Error(ErrorCodes.userNotFound.toString());
      return userDto;
    })
  );

  return zip(
    userDtoObs.pipe(
      switchMap((userDto: UserDTO) =>
        inventoryDTOtoInventoryObs(userDto.inventory)
      )
    ),
    userDtoObs
  ).pipe(
    map((zippedData: [Inventory, UserDTO]) =>
      userDTOtoUser(zippedData[1], zippedData[0])
    )
  );
}
