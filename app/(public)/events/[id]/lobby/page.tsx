import React from "react";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/events";
import VirtualLobbyClient from "@/components/virtual/VirtualLobbyClient";

export default async function VirtualLobbyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  return <VirtualLobbyClient event={event} />;
}
