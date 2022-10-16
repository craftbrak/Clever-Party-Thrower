
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCarInput {
    brand?: Nullable<string>;
    maxPassenger?: Nullable<number>;
    consumption?: Nullable<number>;
    bootSize?: Nullable<number>;
    manual?: Nullable<boolean>;
    owner?: Nullable<CreateUserInput>;
}

export class UpdateCarInput {
    id: number;
    brand?: Nullable<string>;
    maxPassenger?: Nullable<number>;
    consumption?: Nullable<number>;
    bootSize?: Nullable<number>;
    manual?: Nullable<boolean>;
    owner?: Nullable<UpdateUserInput>;
}

export class CreateEventInput {
    name?: Nullable<string>;
    total?: Nullable<number>;
    participants: CreateUserInput[];
}

export class UpdateEventInput {
    id: number;
    name?: Nullable<string>;
    total?: Nullable<number>;
    participants?: Nullable<Nullable<UpdateUserInput>[]>;
}

export class CreateUserInput {
    email: string;
    name: string;
    password: string;
    drivingLicence?: Nullable<boolean>;
    manual?: Nullable<boolean>;
    events?: Nullable<Nullable<CreateEventInput>[]>;
}

export class UpdateUserInput {
    id: number;
    email?: Nullable<string>;
    name?: Nullable<string>;
    password?: Nullable<string>;
    drivingLicence?: Nullable<boolean>;
    manual?: Nullable<boolean>;
    events?: Nullable<Nullable<UpdateEventInput>[]>;
}

export class Car {
    id?: Nullable<number>;
    brand?: Nullable<string>;
    maxPassenger?: Nullable<number>;
    consumption?: Nullable<number>;
    bootSize?: Nullable<number>;
    manual?: Nullable<boolean>;
    owner?: Nullable<User>;
}

export abstract class IQuery {
    abstract cars(): Nullable<Car>[] | Promise<Nullable<Car>[]>;

    abstract car(id: number): Nullable<Car> | Promise<Nullable<Car>>;

    abstract events(): Nullable<Event>[] | Promise<Nullable<Event>[]>;

    abstract eventsByUser(id?: Nullable<number>): Nullable<Event>[] | Promise<Nullable<Event>[]>;

    abstract event(id: number): Nullable<Event> | Promise<Nullable<Event>>;

    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(email: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createCar(createCarInput: CreateCarInput): Car | Promise<Car>;

    abstract updateCar(updateCarInput: UpdateCarInput): Car | Promise<Car>;

    abstract removeCar(id: number): Nullable<Car> | Promise<Nullable<Car>>;

    abstract createEvent(createEventInput: CreateEventInput): Event | Promise<Event>;

    abstract updateEvent(updateEventInput: UpdateEventInput): Event | Promise<Event>;

    abstract removeEvent(id: number): Nullable<Event> | Promise<Nullable<Event>>;

    abstract addParticipant(id: number, userId: number): Nullable<Event> | Promise<Nullable<Event>>;

    abstract removeParticipant(id: number, userId: number): Nullable<Event> | Promise<Nullable<Event>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export class Event {
    id?: Nullable<number>;
    name?: Nullable<string>;
    total?: Nullable<number>;
    participants: User[];
}

export class User {
    id?: Nullable<number>;
    email?: Nullable<string>;
    name?: Nullable<string>;
    drivingLicence?: Nullable<boolean>;
    manual?: Nullable<boolean>;
    events?: Nullable<Nullable<Event>[]>;
}

type Nullable<T> = T | null;
