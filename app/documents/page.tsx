"use client"

import { useState } from "react"
import { FileText, Search, FolderOpen, Download, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "../components/header"
import { FooterNav } from "../components/footer-nav"

interface Document {
  id: string
  title: string
  type: string
  category: string
  date: string
  size: string
  new?: boolean
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      title: "安全運転マニュアル",
      type: "PDF",
      category: "マニュアル",
      date: "2025/3/15",
      size: "2.4 MB",
    },
    {
      id: "doc2",
      title: "車両点検チェックリスト",
      type: "PDF",
      category: "チェックリスト",
      date: "2025/3/10",
      size: "1.2 MB",
    },
    {
      id: "doc3",
      title: "配送エリアマップ",
      type: "PDF",
      category: "地図",
      date: "2025/3/5",
      size: "3.8 MB",
    },
    {
      id: "doc4",
      title: "緊急連絡先リスト",
      type: "Excel",
      category: "連絡先",
      date: "2025/3/1",
      size: "0.8 MB",
    },
    {
      id: "doc5",
      title: "新規配送エリア案内",
      type: "PDF",
      category: "お知らせ",
      date: "2025/3/26",
      size: "1.5 MB",
      new: true,
    },
  ])

  const filteredDocuments = searchQuery
    ? documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : documents

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="資料" showBackButton={true} backUrl="/" />

      <main className="container mx-auto p-4">
        {/* 検索バー */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-[#666666]" />
          <Input
            placeholder="資料を検索"
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* カテゴリータブ */}
        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4 h-12 mb-4">
            <TabsTrigger value="all" className="text-sm">
              すべて
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-sm">
              マニュアル
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-sm">
              チェックリスト
            </TabsTrigger>
            <TabsTrigger value="other" className="text-sm">
              その他
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <DocumentList documents={filteredDocuments} />
          </TabsContent>

          <TabsContent value="manual">
            <DocumentList documents={filteredDocuments.filter((doc) => doc.category === "マニュアル")} />
          </TabsContent>

          <TabsContent value="checklist">
            <DocumentList documents={filteredDocuments.filter((doc) => doc.category === "チェックリスト")} />
          </TabsContent>

          <TabsContent value="other">
            <DocumentList
              documents={filteredDocuments.filter(
                (doc) => doc.category !== "マニュアル" && doc.category !== "チェックリスト",
              )}
            />
          </TabsContent>
        </Tabs>

        {/* 最近の資料 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">最近の資料</h2>
          <div className="grid grid-cols-2 gap-4">
            {documents
              .filter((doc) => doc.new)
              .map((doc) => (
                <Card key={doc.id} className="shadow-sm hover:shadow transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center bg-gray-100 h-24 mb-3 rounded">
                      <FileText className="h-12 w-12 text-[#1C3D5A]" />
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-1">{doc.title}</h3>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                      <p className="text-xs text-gray-500">{doc.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </main>

      <FooterNav />
    </div>
  )
}

interface DocumentListProps {
  documents: Document[]
}

function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">資料が見つかりません</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded mr-3">
              <FileText className="h-6 w-6 text-[#1C3D5A]" />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{doc.title}</h3>
                {doc.new && <Badge className="ml-2 bg-green-500 text-xs">新規</Badge>}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">{doc.type}</span>
                <span className="mr-2">•</span>
                <span className="mr-2">{doc.category}</span>
                <span className="mr-2">•</span>
                <span>{doc.size}</span>
              </div>
            </div>
          </div>

          <div className="flex">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

