import path from 'path';
import {createFilter} from 'rollup-pluginutils';
import postcss from 'postcss';


function cwd(file) {
  return path.join(process.cwd(), file);
}

export default function(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  const extensions = options.extensions || ['.css', '.sss'];

  return {
    transform(code, id) {
      if (!filter(id)) {
        return null;
      }
      if (extensions.indexOf(path.extname(id)) === -1) {
        return null;
      }
      const opts = {
        from: options.from ? cwd(options.from) : id,
        to: options.to ? cwd(options.to) : id,
        map: {
          inline: false,
          annotation: false,
        },
        parser: options.parser,
      };

      return Promise.resolve()
        .then(() => {
          if (options.preprocessor) {
            return options.preprocessor(code, id);
          }
          return {code};
        })
        .then(input => {
          if (input.map && input.map.mappings) {
            opts.map.prev = input.map;
          }
          return postcss(options.plugins || [])
            .process(
              input.code.replace(
                /\/\*[@#][\s\t]+sourceMappingURL=.*?\*\/$/gm,
                ''
              ),
              opts
            )
            .then(result => ({
              code: `export default ${JSON.stringify(result.css)};`,
              map: (options.sourceMap || options.sourcemap) && result.map ?
                  JSON.parse(result.map) : {mappings: ''},
            }));
        });
    },
  };
}
