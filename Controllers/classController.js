import fs from 'fs'
import Handlebars from 'handlebars';
export function generateModel(req,res){
    const templateSource=fs.readFileSync('./templates/classtemplate.hbs',"utf-8")
    const template = Handlebars.compile(templateSource);
    const pathProject = `./public/${req.params.nameProject}`
    fs.mkdir(pathProject, (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({"error":err})
        } else {
          console.log('project file created successfully');          
        }
      });
    fs.mkdir(`${pathProject}/models`, (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({"error":err})
        } else {
          console.log('models created successfully');                
        }
      });
      fs.mkdir(`${pathProject}/Controllers`, (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({"error":err})
        } else {
          console.log('Controllers created successfully');                
        }
      });
      req.body.classes.forEach(c=>{        
        creatModels(c,req,`${pathProject}/models`,template)  
        createControllers(c,`${pathProject}/Controllers`,template)  
      }) 
      createMiddlewares(`${pathProject}/Middlewares`)
      res.status(200).json({"response":`project ${req.params.nameProject} is created`})    
}
function findNameById(id,array){
   return array.find(t=>id==t.id).className;
}
function createMiddlewares(path){
  fs.mkdir(path, (err) => {
        if (err) {
          console.error(err);
        } else {
          const templateSource=fs.readFileSync('./templates/multerImageTemplate.hbs',"utf-8")
          const template = Handlebars.compile(templateSource);
          console.log('Middlewares created successfully');
          const result = template();
          fs.writeFileSync(`${path}/multer-config.js`,`${result.toString()}`);                    
        }
      });
}




function createControllers(c,path){
  const templateSource=fs.readFileSync('./templates/controllerTemplate.hbs',"utf-8")
  const template = Handlebars.compile(templateSource);
  const data = {
    "name":c.className,
    "attrs":c.attrs.filter(a=>a.attrName!=="image").map(a=>{return{"attrName":a.attrName,"moduleName":c.className}}),
    "containImage": c.attrs.some(e=>e.attrName =="image")
  }
  const result = template(data);
  fs.writeFileSync(`${path}/${c.className}Controller.js`,`${result.toString()}`);
}




function creatModels(c,req,path,template){
  let relationships =req.body.relationships.filter(r=>r.c1==c.id);
            relationships = relationships.map(r=>{return {"name":r.name,"c1":findNameById(r.c1,req.body.classes),"c2":findNameById(r.c2,req.body.classes)
            ,"isArray":r.c2IsMany,"isRequired":true,"isManyToMany":r.c1IsMany&&r.c2IsMany,"attrs":r.attrs}})
            const data={
                classAtt:c,
                r:relationships
            }
            const result = template(data);
            fs.writeFileSync(`${path}/${c.className}.js`,`${result.toString()}`);
            relationships.filter(e=>e.isManyToMany).forEach(r=>{
                const templateMMSource=fs.readFileSync('./templates/manyToManyTemplate.hbs',"utf-8")
                const templateMM = Handlebars.compile(templateMMSource);
                const resultManyToMany= templateMM(r);
                fs.writeFileSync(`${path}/${r.c1}_${r.name}_${r.c2}.js`,`${resultManyToMany.toString()}`);
            })
}