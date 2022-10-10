import { prismaClient } from '@/prisma/prisma.client';
import { User, Event, Music,ShopingListItem,Spending } from '@prisma/client';

class EventService {
  private events = prismaClient.event;

  /***
   * @return all the events
   ***/
  public async findAll() {
    return await this.events.findMany();
  }
  public async findByUser(user: User): Promise<Event[]> {
    return await this.events.findMany({
      where: {
        participants: { some: user },
      },
    });
  }
  public async findById(id: number): Promise<Event> {
    return await this.events.findUnique({
      where: {
        id: id,
      },
    });
  }
  public async getParticipants(event):Promise<User[]>{
    return this.events.findUnique({where:{id:event.id}}).participants()
  }
  public async getPlaylist(event):Promise<Music[]>{
    return this.events.findUnique({where:{id:event.id}}).playlist()
  }
  public async getShoppingList(event):Promise<ShopingListItem[]>{
    return this.events.findUnique({where:{id:event.id}}).shopingList()
  }
  public async getSpendings(event:Event):Promise<Spending[]>{
    return this.events.findUnique({where:{id:event.id}}).spendings()
  }

  public async update(event: Event): Promise<Event> {
    return this.events.update({
      where: {
        id: event.id,
      },
      data: event,
    });
  }
  public async create(event: Event):Promise<Event>{
    return this.events.create({data:event})
  }
}
export default EventService;
