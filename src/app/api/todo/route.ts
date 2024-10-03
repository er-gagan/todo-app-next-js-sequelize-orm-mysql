

import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server"
import qs from 'qs';

export async function POST(request: NextRequest) {
    try {
        let payload: any = await request.json()
        const { id, title, description } = payload

        if (!title || !description) return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 })

        if (id) {
            const todo = await Todo.update(payload, {
                where: {
                    id
                }
            })
            return NextResponse.json({ success: true, message: "Todo updated successfully", data: todo }, { status: 200 })
        } else {
            const todo = await Todo.create(payload)

            return NextResponse.json({ success: true, message: "Todo created successfully", data: todo }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong", data: error }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const rawParams = request.url.split('?')[1];
        const params: any = qs.parse(rawParams);
        const { id, currentPage, perPage, search } = params
        const _currentPage = Number(currentPage)
        const _perPage = Number(perPage)
        if (id) {
            const todo = await Todo.findByPk(id)
            return NextResponse.json({ success: true, message: "Todo fetched successfully", data: todo }, { status: 200 })
        } else if (currentPage && perPage && !search) {
            const count = await Todo.count()
            const todos = await Todo.findAll({
                limit: _perPage,
                offset: (_currentPage - 1) * _perPage,
                // order: [['created_at', 'DESC']]
            })
            // const count = await prisma.todo.count()
            // const todos = await prisma.todo.findMany({
            //     skip: (_currentPage - 1) * _perPage,
            //     take: _perPage
            //     // orderBy: {
            //     //     created_at: 'desc',
            //     // }    
            // })

            return NextResponse.json({ success: true, message: "Todos fetched successfully", data: { todos, count } }, { status: 200 })
        } else if (currentPage && perPage && search) {
            const count = await Todo.count()
            const todos = await Todo.findAll({
                where: {
                    OR: [
                        {
                            title: {
                                contains: search
                            }
                        },
                        {
                            description: {
                                contains: search
                            }
                        }
                    ]
                },
                limit: _perPage,
                offset: (_currentPage - 1) * _perPage
            })
            // const count = await prisma.todo.count()
            // const todos = await prisma.todo.findMany({
            //     where: {
            //         OR: [
            //             {
            //                 title: {
            //                     contains: search
            //                 }
            //             },
            //             {
            //                 description: {
            //                     contains: search
            //                 }
            //             }
            //         ]
            //     },
            //     skip: (_currentPage - 1) * _perPage,
            //     take: _perPage
            // })
            return NextResponse.json({ success: true, message: "Todos fetched successfully", data: { todos, count } }, { status: 200 })
        } else {
            const todos = await Todo.findAll()
            return NextResponse.json({ success: true, message: "Todos fetched successfully", data: todos }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong", data: error }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json()
        if (!id) return NextResponse.json({ success: false, message: "Id is required" }, { status: 400 })
        if (Array.isArray(id) && id.length > 0) {
            const todo = await Todo.destroy({
                where: {
                    id: {
                        in: id
                    }
                }
            })
            return NextResponse.json({ success: true, message: "Todos deleted successfully", data: todo }, { status: 200 })
        } else {
            const todo = await Todo.destroy({
                where: {
                    id
                }
            })
            return NextResponse.json({ success: true, message: "Todo deleted successfully", data: todo }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong", data: error }, { status: 500 })
    }
}