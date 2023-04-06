/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) {}
    getBookmarks(userId: string){

        return this.prisma.bookmark.findMany({
            where:{
                userId
            }
        })
    }

    async getBookmarkById(userId:string , bookmarkId:string){
        const bookmark= await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId,
            }
        });
        if(!bookmark || bookmark.userId !== userId){
             throw new Error('No Resources found');
        }
        return bookmark;
    }

    async createBookmark(userId:string, dto:CreateBookmarkDto){

        const bookmark= await this.prisma.bookmark.create({

            data:{
                userId,
                ...dto
            }
        });
        return bookmark;
    }

    async editBookmarkById(userId:string, bookmarkId:string,dto:EditBookmarkDto){
        
        const bookmark= await this.getBookmarkById(userId,bookmarkId);
        
        if(!bookmark || bookmark.userId !== userId || bookmark.id !== bookmarkId ){
             throw new Error('You are not authorized to edit this bookmark');
        }
        const updatedBookmark= await this.prisma.bookmark.update({
            where: {
                id:bookmarkId,
            },
            data:{
                ...dto,
            }
        });
        return updatedBookmark;
    }

    async deleteBookmarkById(userId:string, bookmarkId:string){

        const bookmark= await this.getBookmarkById(userId,bookmarkId);
        if(!bookmark || bookmark.userId !== userId || bookmark.id !== bookmarkId ){
             throw new Error('You are not authorized to Delete this bookmark');
        }
        await this.prisma.bookmark.delete({
            where:{id:bookmarkId,}
        });
        return "deleted Bookmark"

    }

}
