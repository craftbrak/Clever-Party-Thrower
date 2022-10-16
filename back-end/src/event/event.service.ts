import { Injectable } from "@nestjs/common";
import { CreateEventInput, UpdateEventInput } from "../graphql";
import { DbService } from "../db/db.service";

@Injectable()
export class EventService {
  constructor(private prismaClient: DbService) {
  }

  create(createEventInput: CreateEventInput) {
    return this.prismaClient.event.create({
      data: {
        name: createEventInput.name,
        total: createEventInput.total,
        participants: {
          connect: createEventInput.participants
        }
      }
    });
  }

  findAll() {
    return this.prismaClient.event.findMany();
  }

  findOne(id: number) {
    return this.prismaClient.event.findUnique({
      where: {
        id: id
      },
      include: {
        participants: true
      }
    });
  }

  findAllOfUser(useIid: number) {
    return this.prismaClient.user.findUnique({
      where: {
        id: useIid
      }
    }).events({
      include: {
        participants: true
      }
    });
  }

  findParticipants(eventId: number) {
    return this.prismaClient.event.findUnique({
      where: {
        id: eventId
      }
    }).participants();
  }

  update(id: number, updateEventInput: UpdateEventInput) {
    return this.prismaClient.event.update({
      where: {
        id: id
      },
      data: {
        name: updateEventInput.name,
        total: updateEventInput.total
      }
    });
  }

  remove(id: number) {
    return this.prismaClient.event.delete({where:{id:id}});
  }

  addParticipant(id: number, userId: number) {
    return this.prismaClient.event.update({
      where: {
        id: id
      },
      data: {
        participants: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  removeParticipant(id: number, userId: number) {
    return this.prismaClient.event.update({
      where: {
        id: id
      },
      data: {
        participants: {
          disconnect: {
            id: userId
          }
        }
      }
    });
  }
}
