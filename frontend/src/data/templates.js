export const templates = {

  huntingtons: {

    name: "Huntington's Disease",

    nodes: [
      {
        id: "1",
        type: "person",
        position: { x: 100, y: 50 },
        data: {
          label: "Grandfather",
          gender: "male",
          affected: true,
          generation: 1,
        },
      },

      {
        id: "2",
        type: "person",
        position: { x: 100, y: 200 },
        data: {
          label: "Father",
          gender: "male",
          affected: true,
          generation: 2,
        },
      },

      {
        id: "3",
        type: "person",
        position: { x: 100, y: 350 },
        data: {
          label: "Child",
          gender: "male",
          affected: true,
          generation: 3,
        },
      },
    ],

    edges: [
      {
        id: "e1",
        source: "1",
        target: "2",
      },

      {
        id: "e2",
        source: "2",
        target: "3",
      },
    ],
  },

  thalassemia: {

    name: "Thalassemia",

    nodes: [
      {
        id: "1",
        type: "person",
        position: { x: 100, y: 50 },
        data: {
          label: "Father",
          gender: "male",
          affected: false,
          generation: 1,
        },
      },

      {
        id: "2",
        type: "person",
        position: { x: 300, y: 50 },
        data: {
          label: "Mother",
          gender: "female",
          affected: false,
          generation: 1,
        },
      },

      {
        id: "3",
        type: "person",
        position: { x: 200, y: 250 },
        data: {
          label: "Child",
          gender: "male",
          affected: true,
          generation: 2,
        },
      },
    ],

    edges: [
      {
        id: "e1",
        source: "1",
        target: "3",
      },

      {
        id: "e2",
        source: "2",
        target: "3",
      },
    ],
  },

  colorBlindness: {

    name: "Color Blindness",

    nodes: [

        {
        id: "1",
        type: "person",
        position: { x: 100, y: 50 },
        data: {
            label: "Father",
            gender: "male",
            affected: false,
            generation: 1,
        },
        },

        {
        id: "2",
        type: "person",
        position: { x: 300, y: 50 },
        data: {
            label: "Mother",
            gender: "female",
            affected: false,
            generation: 1,
        },
        },

        {
        id: "3",
        type: "person",
        position: { x: 100, y: 250 },
        data: {
            label: "Son 1",
            gender: "male",
            affected: true,
            generation: 2,
        },
        },

        {
        id: "4",
        type: "person",
        position: { x: 300, y: 250 },
        data: {
            label: "Son 2",
            gender: "male",
            affected: true,
            generation: 2,
        },
        },

        {
        id: "5",
        type: "person",
        position: { x: 500, y: 250 },
        data: {
            label: "Daughter",
            gender: "female",
            affected: false,
            generation: 2,
        },
        },

    ],

    edges: [

        {
        id: "e1",
        source: "1",
        target: "3",
        },

        {
        id: "e2",
        source: "2",
        target: "3",
        },

        {
        id: "e3",
        source: "1",
        target: "4",
        },

        {
        id: "e4",
        source: "2",
        target: "4",
        },

        {
        id: "e5",
        source: "1",
        target: "5",
        },

        {
        id: "e6",
        source: "2",
        target: "5",
        },
    ],
    },
};