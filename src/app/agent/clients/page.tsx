"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Pause, 
  Play, 
  Calendar,
  Mail,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  NotebookPen,
  FileText,
  Sparkles
} from "lucide-react";
import { AgentClient, INITIAL_AGENT_CLIENTS, ClientNote } from "@/data/agent-clients";

export default function AgentClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState<AgentClient[]>(INITIAL_AGENT_CLIENTS);
  const [pendingExtension, setPendingExtension] = useState<{ client: AgentClient; days: number } | null>(null);
  const [activeNotesClientId, setActiveNotesClientId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [instructionsClientId, setInstructionsClientId] = useState<string | null>(null);
  const [instructionsDraft, setInstructionsDraft] = useState<string>("");

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    accessExpiry: ''
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeClients = clients.filter(client => client.status === 'active').length;
  const maxClients = 10; // Agent's limit

  const handleAddClient = () => {
    if (newClient.name && newClient.email && newClient.accessExpiry) {
      const client: AgentClient = {
        id: `client-${Date.now()}`,
        name: newClient.name,
        email: newClient.email,
        status: 'active',
        accessExpiry: new Date(newClient.accessExpiry),
        createdAt: new Date(),
        lastActive: new Date(),
        propertiesViewed: 0,
        chatSessions: 0
      };
      setClients([...clients, client]);
      setNewClient({ name: '', email: '', accessExpiry: '' });
      setIsAddClientOpen(false);
    }
  };

  const handleStatusChange = (clientId: string, newStatus: 'active' | 'paused' | 'expired') => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, status: newStatus } : client
    ));
  };

  const handleExtendAccess = (clientId: string, days: number) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, accessExpiry: new Date(client.accessExpiry.getTime() + days * 24 * 60 * 60 * 1000) }
        : client
    ));
  };

  const handleConfirmExtend = () => {
    if (pendingExtension) {
      handleExtendAccess(pendingExtension.client.id, pendingExtension.days);
      setPendingExtension(null);
    }
  };

  const pendingLabel = pendingExtension
    ? `Extend by ${pendingExtension.days} days`
    : "";

  const getClientById = (id: string | null) =>
    id ? clients.find((client) => client.id === id) ?? null : null;

  const activeNotesClient = getClientById(activeNotesClientId);
  const instructionsClient = getClientById(instructionsClientId);

  const handleOpenNotes = (client: AgentClient) => {
    setActiveNotesClientId(client.id);
    setNoteDraft("");
    setEditingNoteId(null);
  };

  const handleCloseNotes = () => {
    setActiveNotesClientId(null);
    setNoteDraft("");
    setEditingNoteId(null);
  };

  const handleSaveNote = () => {
    if (!activeNotesClient || !noteDraft.trim()) return;

    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== activeNotesClient.id) return client;
        const notes = client.notes ? [...client.notes] : [];
        if (editingNoteId) {
          return {
            ...client,
            notes: notes.map((note) =>
              note.id === editingNoteId
                ? { ...note, text: noteDraft.trim(), updatedAt: new Date() }
                : note
            ),
          };
        }
        const newNote: ClientNote = {
          id: `note-${Date.now()}`,
          text: noteDraft.trim(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return {
          ...client,
          notes: [newNote, ...notes],
        };
      })
    );

    setNoteDraft("");
    setEditingNoteId(null);
  };

  const handleEditNote = (note: ClientNote) => {
    setEditingNoteId(note.id);
    setNoteDraft(note.text);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!activeNotesClient) return;
    setClients((prev) =>
      prev.map((client) =>
        client.id === activeNotesClient.id
          ? {
              ...client,
              notes: (client.notes || []).filter((note) => note.id !== noteId),
            }
          : client
      )
    );
  };

  const handleOpenInstructions = (client: AgentClient) => {
    setInstructionsClientId(client.id);
    setInstructionsDraft(client.aiInstructions || "");
  };

  const handleCloseInstructions = () => {
    setInstructionsClientId(null);
    setInstructionsDraft("");
  };

  const handleSaveInstructions = () => {
    if (!instructionsClient) return;
    setClients((prev) =>
      prev.map((client) =>
        client.id === instructionsClient.id
          ? {
              ...client,
              aiInstructions: instructionsDraft.trim(),
            }
          : client
      )
    );
    handleCloseInstructions();
  };

  const handleImproveInstructions = () => {
    setInstructionsDraft(
      "Provide proactive weekly market check-ins with curated opportunities, emphasizing how each recommendation aligns with the client's goals."
    );
  };

  const formatDateTime = (date: Date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'paused': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Paused</Badge>;
      case 'expired': return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime())) / (1000 * 60 * 60 * 24);
    
    if (diffInDays < 1) return 'Today';
    if (diffInDays < 2) return 'Yesterday';
    if (diffInDays < 7) return `${Math.floor(diffInDays)} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="flex h-screen bg-background">
      <CustomSidebar activePage="clients" mode="agent" />
      
      {/* Agent Portal Badge */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-3 py-1">
          Agent Portal
        </Badge>
      </div>
      
      <div className="flex-1 ml-16">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Client Management</h1>
                <Badge variant="secondary" className="text-sm">
                  {activeClients}/{maxClients} Active
                </Badge>
              </div>
              
              <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Client Name</label>
                      <Input
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                        placeholder="Enter client name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        value={newClient.email}
                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                        placeholder="Enter email address"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Access Expiry</label>
                      <Input
                        type="date"
                        value={newClient.accessExpiry}
                        onChange={(e) => setNewClient({...newClient, accessExpiry: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddClient}>
                        Add Client
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Client List */}
        <div className="p-6">
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        {client.avatar ? (
                          <AvatarImage src={client.avatar} alt={client.name} />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          {getStatusIcon(client.status)}
                          {getStatusBadge(client.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires {formatDate(client.accessExpiry)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last active {formatTimeAgo(client.lastActive)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{client.propertiesViewed} properties viewed</span>
                          <span>{client.chatSessions} chat sessions</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                          asChild
                        >
                          <Link href={`/agent/clients/${client.id}`}>
                            Details and Timeframe
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPendingExtension({ client, days: 30 })}
                          className="text-xs"
                        >
                          +30 days
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPendingExtension({ client, days: 90 })}
                          className="text-xs"
                        >
                          +90 days
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {client.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(client.id, 'paused')}>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause Access
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(client.id, 'active')}>
                                <Play className="w-4 h-4 mr-2" />
                                Resume Access
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(client.id, 'expired')}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenNotes(client)}
                          className="text-xs"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" /> Notes
                          {client.notes && client.notes.length > 0 && (
                            <span className="ml-1 inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                              {client.notes.length}
                            </span>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenInstructions(client)}
                          className="text-xs"
                        >
                          <NotebookPen className="w-3.5 h-3.5 mr-1" /> AI Instructions
                          {client.aiInstructions && client.aiInstructions.trim().length > 0 && (
                            <span className="ml-1 inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-purple-500/90 text-[10px] font-semibold text-white">
                              •
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No clients found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms.' : 'Start by adding your first client.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddClientOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Client
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Dialog
        open={!!pendingExtension}
        onOpenChange={(open) => {
          if (!open) setPendingExtension(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm Access Extension</DialogTitle>
            <DialogDescription>
              {pendingExtension && (
                <span>
                  Extend <strong>{pendingExtension.client.name}</strong>&apos;s access by {pendingExtension.days} days? Their new expiry will be adjusted automatically.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingExtension(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmExtend}>
              {pendingLabel || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!activeNotesClient} onOpenChange={(open) => (open ? null : handleCloseNotes())}>
        <DialogContent className="sm:max-w-xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Client Notes</DialogTitle>
            <DialogDescription>
              {activeNotesClient ? `Internal notes for ${activeNotesClient.name}. Notes are private to the agent.` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh]">
            <div>
              <label className="text-sm font-medium mb-2 block">{editingNoteId ? "Update note" : "Add new note"}</label>
              <textarea
                className="w-full min-h-[110px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add context that will help you or your team serve this client"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                {editingNoteId && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingNoteId(null);
                    setNoteDraft("");
                  }}>
                    Cancel edit
                  </Button>
                )}
                <Button size="sm" onClick={handleSaveNote}>
                  {editingNoteId ? "Save changes" : "Add note"}
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto pr-2" style={{ maxHeight: "28vh" }}>
              {activeNotesClient && activeNotesClient.notes && activeNotesClient.notes.length > 0 ? (
                <div className="space-y-4">
                  {[...(activeNotesClient.notes || [])]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((note) => (
                      <div key={note.id} className="relative pl-4">
                        <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary"></span>
                        <div className="rounded-md border border-border/80 bg-muted/40 px-4 py-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                              {formatDateTime(note.createdAt)}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleEditNote(note)}>
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-red-600"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground">{note.text}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                  No notes yet. Add your first note to capture key details about this client.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseNotes}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!instructionsClient}
        onOpenChange={(open) => {
          if (!open) handleCloseInstructions();
        }}
      >
        <DialogContent className="sm:max-w-lg" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>AI Agent Instructions</DialogTitle>
            <DialogDescription>
              {instructionsClient
                ? `Tailor how the AI assistant responds for ${instructionsClient.name}.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm font-medium" htmlFor="instructions-textarea">
              Guidance for the AI agent
            </label>
            <textarea
              id="instructions-textarea"
              className="w-full min-h-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={instructionsDraft}
              onChange={(e) => setInstructionsDraft(e.target.value)}
              placeholder="Example: Focus on properties with home offices and mention nearby Montessori schools."
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleImproveInstructions}>
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Improve instructions
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCloseInstructions}>
                  Cancel
                </Button>
                <Button onClick={handleSaveInstructions}>Save</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
