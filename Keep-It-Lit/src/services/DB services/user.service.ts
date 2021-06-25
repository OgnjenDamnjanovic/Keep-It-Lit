import { from, Observable, of, zip } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { USERS_URL } from "../../misc/API URLs";
import { ErrorCodes } from "../../misc/ErrorCodes";
import { inventoryDTOtoInventoryObs } from "../../models/DTOs/inventory-dto";
import { createInitialUserDTO, UserDTO, userDTOtoUser } from "../../models/DTOs/user-dto";
import { Inventory } from "../../models/inventory";
import { User } from "../../models/user";

export function createUser(username: string, password: string) {
  return from(
    fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(createInitialUserDTO(username,password)),
      headers: {
        "Content-Type": "application/json",
      },
    })
  )
}
export function getUserDtoObs(
  username: string,
  password: string
): Observable<UserDTO> {
  return from(
    fetch(USERS_URL + `?username=${username}&password=${password}`)
      .then((result) => result.json())
      .then((users: Array<UserDTO>) => users[0])
  );
}
export function getUserObs(
  username: string,
  password: string
): Observable<User> {
  const userDtoObs = getUserDtoObs(username, password).pipe(
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
export function checkUsernameExistsObs(username: string): Observable<boolean> {
  return from(
    fetch(USERS_URL + `?username=${username}`).then((result) => result.json())
  ).pipe(map((users: Array<UserDTO>) => users[0] != null));
}
