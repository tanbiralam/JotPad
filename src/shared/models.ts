export type NoteInfo = {
  title: string
  lastEditTime: number
  ext: string
}

export type NoteContent = string

export type TrashInfo = NoteInfo & { deletedAt: number }
