"use client";
import { generateTournamentGroups } from "@/actions/tournament";
import React from "react";
import { Button } from "react-bootstrap";

export default function TournamentGroupsGenerator({ players, tournamentData }) {
  const generateGroups = () => {
    const groups = generateTournamentGroups(
      players,
      tournamentData.num_grupos,
      tournamentData.plazas_torneo
    );
  };

  return (
    <div>
      <Button variant="primary" onClick={generateGroups}>
        Generar grupos
      </Button>
    </div>
  );
}
