/**
 * Map of CWL specified types to the Ember UI components that can provide their data
 * @type {[*]}
 */
const ComponentSettings = [
  {
    // Generic file group
    cwlType: { type: 'array', items: { type: 'array', items: 'File' } }, // From CWL
    name: 'file-group-list',  // Component to render
    formats: [
      {
        title: 'File',
        groupName: 'File Group'
      }
    ]
  },
  {
    // Bespin CWL file pair
    cwlType: { type: 'array', items: '#bespin-types.yml/NamedFASTQFilePairType'}, // Defined in CWL
    name: 'fastq-file-pair-list',  // Component to render
    formats: [
      {
        title: 'FASTQ',
        format: 'http://edamontology.org/format_1930',
        fileNameRegexStr: '.*(fq$)|(fq.gz$)|(fastq$)|(fastq.gz$)',
        groupName: 'Sample'
      }
    ]
  }
];

export default ComponentSettings;
